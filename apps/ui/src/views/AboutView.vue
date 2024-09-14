<template>
  <div class="container">
    <h1 style="font-size: 40px">About</h1>
    <div class="about">
      <h2 class="about-content">
        RPI TV is RPI's student-run, volunteer television club.
        We film various campus events and sports in an effort to
        preserve campus culture through video. Full videos of all
        the events we film can be watched for free on our <a href="https://www.youtube.com/@rpi-tv" target="_blank">youtube channel</a>.
      </h2>
      <div class="about-content">
        <iframe src="https://www.youtube.com/embed/MfzmM3EFqIY?si=Q0ovRqJmr46-NN7z" allowfullscreen class="video-player" />
      </div>
    </div>
    <div class="team mt-10">
      <h1>Our Team</h1>
      <div v-if="queryData.loading.value">
        Loading Members...
      </div>
      <div v-else class="membership">
        <h2 class="ml-5">Leadership</h2>
          <div class="members ml-5">
            <div v-for="officer in officers" class="member-container" :key="officer.id">
              <v-avatar :rounded="officer.person?.profilePicture?.path ? 'default' : 0" size="150" :image="officer.person?.profilePicture?.path ?? rpitvLogo" />
              <h3>{{ officer.person?.name }}</h3>
              <h4 class="role">{{ officer.role?.name }}</h4>
            </div>
          </div>
        <h2 class="ml-5">Members</h2>
        <div class="members ml-5">
          <div v-for="member in members" class="member-container" :key="member.id">
            <v-avatar rounded="0" size="150" :image="member.person?.profilePicture?.path ?? rpitvLogo" />
            <h3>{{ member.person?.name }}</h3>
            <h4 class="role">{{ member.role?.name }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FindPersonRolesDocument } from "@/graphql/types";
import type { PersonRole } from "@/graphql/types";
import { useQuery } from "@vue/apollo-composable";
import { ref } from "vue";
import rpitvLogo from "../assets/rpitv_logo.svg";

const peopleRoles = ref<PersonRole[]>([]);
const officers = ref<PersonRole[]>([]);
const members = ref<PersonRole[]>([]);

const queryData = useQuery(FindPersonRolesDocument, {
  filter: {
    startTime: {
      lt: new Date().toISOString(),
    },
    endTime: {
      gt: new Date().toISOString()
    },
  }
});

queryData.onResult((result) => {
  if (result.loading) return;
  peopleRoles.value = result.data.personRoles;
  officers.value = peopleRoles.value.filter((personRole) => personRole.role?.displayInLeadership && personRole.role?.displayInMembership);
  officers.value.sort((a, b) => b.role!.priority as number - (a.role!.priority as number));
  members.value = peopleRoles.value.filter((personRole) => !personRole.role?.displayInLeadership && personRole.role?.displayInMembership);
  members.value.sort((a, b) => b.person?.name!.toUpperCase() as string > (a.person?.name!.toUpperCase() as string) ? -1 : 1);
});

</script>

<style scoped lang="scss">
.about {
  display: flex;
  justify-content: space-between;
  @media (max-width: 1000px) {
    flex-wrap: wrap;
  }
}

.about-content {
  width: 47%;
  @media (max-width: 1000px) {
    width: 100%;
    margin-bottom: 25px;
  }
}

.video-player {
  aspect-ratio: 16 / 9;
  width: 100%;
  border: 0;
}

.members {
  width: 100%;
  display: grid;
  grid-auto-rows: 250px;
  grid-template-columns: repeat(auto-fit, 200px) ;
}
.member-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;
}
.role {
  color: #ff8697
}
</style>
